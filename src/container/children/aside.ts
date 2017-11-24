import { Component, ElementRef, Input, OnInit } from '@angular/core'
import { removeNgTag } from '../../shared/utils'

@Component({
  selector: 'el-aside',
  template: `
    <aside [class]="'el-aside ' + class" [ngStyle]="{width: width}">
      <ng-content></ng-content>
    </aside>
  `,
})
export class ElAside implements OnInit {
  
  @Input() width: string = '300px'
  @Input() class: string
  
  constructor(
    private el: ElementRef,
  ) {
  }
  
  ngOnInit(): void {
    removeNgTag(this.el.nativeElement)
  }
}
