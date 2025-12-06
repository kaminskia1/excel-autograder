import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Converts object keys from snake_case to camelCase
 */
function toCamelCase(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  }

  if (typeof obj === 'object' && !(obj instanceof Date) && !(obj instanceof File) && !(obj instanceof Blob)) {
    const converted: Record<string, unknown> = {};
    for (const key of Object.keys(obj as Record<string, unknown>)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      converted[camelKey] = toCamelCase((obj as Record<string, unknown>)[key]);
    }
    return converted;
  }

  return obj;
}

/**
 * Converts object keys from camelCase to snake_case
 */
function toSnakeCase(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  }

  if (typeof obj === 'object' && !(obj instanceof Date) && !(obj instanceof File) && !(obj instanceof Blob) && !(obj instanceof FormData)) {
    const converted: Record<string, unknown> = {};
    for (const key of Object.keys(obj as Record<string, unknown>)) {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      converted[snakeKey] = toSnakeCase((obj as Record<string, unknown>)[key]);
    }
    return converted;
  }

  return obj;
}

/**
 * Interceptor that converts between camelCase (frontend) and snake_case (backend).
 * - Outgoing requests: camelCase → snake_case
 * - Incoming responses: snake_case → camelCase
 */
@Injectable()
export class CaseInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Transform request body to snake_case (skip FormData for file uploads)
    let transformedReq = req;
    if (req.body && !(req.body instanceof FormData)) {
      transformedReq = req.clone({
        body: toSnakeCase(req.body),
      });
    }

    return next.handle(transformedReq).pipe(
      map((event) => {
        // Transform response body to camelCase
        if (event instanceof HttpResponse && event.body) {
          return event.clone({
            body: toCamelCase(event.body),
          });
        }
        return event;
      }),
    );
  }
}
