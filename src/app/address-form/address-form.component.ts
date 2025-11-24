import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder, FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
  Validators
} from '@angular/forms';
import {noop, Subscription} from 'rxjs';

@Component({
  selector: 'address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: AddressFormComponent
    }
  ]
})
export class AddressFormComponent implements ControlValueAccessor, OnDestroy {

  @Input()
  legend: string;

  onTouched = () => {
  }
  onChangeSub: Subscription;

  form: FormGroup = this.fb.group({
    addressLine1: [null, [Validators.required]],
    addressLine2: [null, [Validators.required]],
    zipCode: [null, [Validators.required]],
    city: [null, [Validators.required]]
  });

  ngOnDestroy(): void {
    this.onChangeSub.unsubscribe();
  }

  constructor(private fb: FormBuilder) {
  }

  // this method is used to write a new value in the child component
  writeValue(value: any): void {
    if (value) {
      this.form.setValue(value)
    }
  }

  registerOnChange(onChange: any): void {
    /*this.form.valueChanges.subscribe(
      value => onChange(value),
    )*/
    this.onChangeSub = this.form.valueChanges.subscribe(onChange)
  }

  // this method is used by parent form to register onTouched callback
  //  onTouched is a function
  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  setDisabledState?(disabled: boolean): void {
    if (disabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

}



