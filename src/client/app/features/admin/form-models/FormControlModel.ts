import 'reflect-metadata';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const controlsKey = Symbol('controls');

/**
 * Type and validation information for one control
 */
interface FControlInfo {
  ignore: boolean;
  validators?: Validators[];
}

/**
 * Dictionary for all form control info
 */
interface FCMetaData {
  [key: string]: FControlInfo;
}

/**
 * Provides a method to generate a Angular Form Control group using the properties of this
 * class that are decorated with FormControl decorators {@link FControl}
 */
export abstract class FormControlModel<T> {

  protected _formGroup: FormGroup;

  constructor() {
  }

  /**
   * Creates a Angular FormGroup and binds it values to this models properties
   * @returns {{[p: string]: any}}
   */
  buildForm(formBuilder: FormBuilder) {
    const controls: { [p: string]: any } = {};
    const metaData = Reflect.getOwnMetadata(controlsKey, Object.getPrototypeOf(this));

    if (!metaData) {
      this._formGroup = formBuilder.group(controls);
      return;
    }

    // Create the form controls
    Object.getOwnPropertyNames(metaData).forEach((key) => {

      const info: FControlInfo = metaData[key];

      if (info.ignore) {
        return;
      }

      const initValue = (this[key] !== undefined) ? this[key] : null;

      if (info.validators) {
        controls[key] = [initValue, info.validators];
      } else {
        controls[key] = [initValue];
      }

    });

    // Build the form group
    this._formGroup = formBuilder.group(controls);

    // Map the models properties to the form group's values
    Object.getOwnPropertyNames(metaData).forEach((key) => {
      const _formGroup = this._formGroup;

      const getter = function () {
        return _formGroup.get(key).value;
      };

      const setter = function(newVal) {
        _formGroup.get(key).setValue(newVal, {onlySelf: true, emitEvent: true});
      };

      if (delete this[key]) {
        Object.defineProperty(this, key, {
          get: getter,
          set: setter,
          enumerable: true,
          configurable: true
        });
      }

    });

  }

  /**
   * Gets the underlying FormGroup for this model
   * @returns {FormGroup}
   */
  get Form(): FormGroup {
    return this._formGroup;
  }

  /**
   * Gets the underlying FormGroup's validity
   * @returns {boolean}
   */
  get Valid(): boolean{
    return this._formGroup.valid;
  }

  getFormValue(): any {
    return this._formGroup.value;
  }

  getRawFormValue(): any {
    return this._formGroup.getRawValue();
  }

  abstract mapToModel(): T;
}

/**
 * Registers a FormControl of the specified
 * @param {boolean} ignore
 * @param {Validators} v
 * @returns {(target: any, key: string) => void}
 * @constructor
 */
function FControl(ignore?: boolean, ...v: Validators[]) {

  return (target: any, key: string) => {
    if (!Reflect.hasMetadata(controlsKey, target)) {
      Reflect.defineMetadata(controlsKey, {}, target);
    }

    const metaData: FCMetaData = Reflect.getMetadata(controlsKey, target);
    const controlInfo: FControlInfo = metaData[key];

    if (controlInfo && controlInfo.ignore) {
      return;
    }

    if (controlInfo && !controlInfo.ignore) {
      controlInfo.validators = controlInfo.validators.concat(v);
    } else {
      metaData[key] = {ignore: ignore, validators: v};
    }
  };
}

export function Ignore(): any {
  return FControl(true);
}

export function Required(...v: Validators[]): any {
  return FControl(false, Validators.required, ...v);
}

export function Optional(...v: Validators[]): any {
  return FControl(false, ...v);
}

// export function Validate(...v: Validators[]) {
//   return (target: any, key: string) => {
//     const metaData: FCMetaData = Reflect.getMetadata(controlsKey, target);
//     if (metaData[key]) {
//       metaData[key].validators = v.concat(metaData[key].validators);
//     } else {
//       metaData[key] = {ignore: false, validators: v};
//     }
//   };
// }
