import { Component, forwardRef, Inject, OnInit, ViewEncapsulation } from '@angular/core'
import { FormBuilder, Validators, FormGroup, FormControl, AbstractControl } from '@angular/forms'
import code from './code'

type validateResult = {
  status: string,
  message?: string,
}

@Component({
  selector: 'ex-form-demo',
  template: ` `,
})
export class ExFormComponentDemo implements OnInit {
  
  private validateForm: FormGroup
  private options: any[] = [{
    value: 'mike',
    label: '加奶油',
    children: [{
      value: 'hot',
      label: '热奶油',
      children: [{
        value: 'more',
        label: '多糖',
      }, {
        value: 'half',
        label: '半糖',
      }, {
        value: 'few',
        label: '少糖',
      }],
    }],
  }, {
    value: 'cafe',
    label: '加咖啡',
    children: [{
      value: 'cubita',
      label: '古巴咖啡',
    }, {
      value: 'brazil',
      label: '巴西咖啡',
    }, {
      value: 'jamaica',
      label: '牙买加咖啡',
    }, {
      value: 'mamba',
      label: '曼巴咖啡',
    }],
  }]
  
  constructor(
    @Inject(forwardRef(() => FormBuilder)) private formBuilder: FormBuilder
  ) {
  }
  
  submit(): void {
    console.log(this.validateForm.controls['mail'])
    console.log(this.validateForm.value)
  }
  reset(): void {
    this.validateForm.reset()
  }
  
  ctrl(item: string): AbstractControl {
    return this.validateForm.controls[item]
  }
  
  statusCtrl(item: string): string {
    if (!this.validateForm.controls[item]) return
    const control: AbstractControl = this.validateForm.controls[item]
    return control.dirty && control.hasError('status') ? control.errors.status : ''
  }
  
  messageCtrl(item: string): string {
    if (!this.validateForm.controls[item]) return
    const control: AbstractControl = this.validateForm.controls[item]
    return control.dirty && control.hasError('message') ? control.errors.message : ''
  }
  
  ngOnInit(): void {
    this.validateForm = this.formBuilder.group({
      password: [ '', [this.passwordValidator] ],
      mail: [ '', [this.emailValidator] ],
      city: [ '' ],
      express: [ '' ],
      invoice: [ '' ],
      discount: [ [] ],
      time: [ '' ],
      num: [ 1 ],
      spec: [ '' ],
      date: [ '', this.passwordValidator ],
    })
  }
  
  private emailValidator = (control: FormControl): validateResult => {
    const mailReg: RegExp = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    if (!mailReg.test(control.value)) {
      return { status: 'error', message: '邮箱格式不正确' }
    }
    return { status: 'success' }
  }
  
  private passwordValidator = (control: FormControl): validateResult => {
    if (!control.value) {
      return { status: 'error', message: '密码是必填的' }
    }
    if (control.value.length < 6) {
      return { status: 'error', message: '密码长度必须大于 6 位' }
    }
    return { status: 'success' }
  }
}


@Component({
  selector: 'ex-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ExFormComponent {
  
  private code: string[] = code
  private page: any = {
    previous: { name: 'Switch 开关', link: '/form/switch' },
    next: { name: 'Slider 滑块', link: '/form/slider' },
  }
  private exClass: any = ExFormComponentDemo
  
}
