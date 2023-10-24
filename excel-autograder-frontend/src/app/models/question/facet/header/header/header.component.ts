import { Component, ComponentRef, Input } from '@angular/core';
import { Facet } from '../../facet';
import { Question } from '../../../question';
import { FacetComponent } from '../../facet.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() question!: Question;

  @Input() facet!: Facet;

  @Input() component!: ComponentRef<FacetComponent>;

  @Input() self!: ComponentRef<HeaderComponent>;

  remove() {
    this.question.removeFacet(this.facet);
    this.component.destroy();
    this.self.destroy(); // inception
  }
}
