import {Component, DoCheck, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Design} from "../design";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-design-personalization',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule
  ],
  templateUrl: './design-personalization.component.html',
  styleUrl: './design-personalization.component.scss'
})
export class DesignPersonalizationComponent implements OnInit, DoCheck {

  private _design?: Design;
  private _designOld?: Design;
  @Input() set design(value: Design) {
    this._design = value;
    this.updateForm();
  }
  @Output()
  public designChange = new EventEmitter<Design>();

  private cancelNextUpdate = false;

  protected form: FormGroup = new FormGroup({
    content: new FormControl(''),
    fontSize: new FormControl(15),
    textAlign: new FormControl(''),
    top: new FormControl(0),
    left: new FormControl(0),
    width: new FormControl(0),
    height: new FormControl(0),
  });

  private updateForm() {
    this.form.get('content')!.setValue(this._design?.content)
    this.form.get('fontSize')!.setValue(this._design?.fontSize)
    this.form.get('textAlign')!.setValue(this._design?.textAlign)
    this.form.get('top')!.setValue(this._design?.top)
    this.form.get('left')!.setValue(this._design?.left)
    this.form.get('width')!.setValue(this._design?.width)
    this.form.get('height')!.setValue(this._design?.height)
    this.cancelNextUpdate = true;
  }

  public ngOnInit(): void {
    this.form.valueChanges.pipe(debounceTime(100)).subscribe(() => {
      if (this.cancelNextUpdate) {
        this.cancelNextUpdate = false;
        return;
      }
      let newDesign: Design = <Design>{...this._design}
      newDesign.content = this.form.get('content')!.value;
      newDesign.fontSize = Number.parseInt(this.form.get('fontSize')!.value);
      newDesign.textAlign = this.form.get('textAlign')!.value;
      newDesign.top = Number.parseInt(this.form.get('top')!.value);
      newDesign.left = Number.parseInt(this.form.get('left')!.value);
      newDesign.width = Number.parseInt(this.form.get('width')!.value);
      newDesign.height = Number.parseInt(this.form.get('height')!.value);
      console.log(newDesign)
      this.designChange.emit(newDesign);
    });
  }

  public ngDoCheck(): void {
    if (this.hasChanged(this._design!, this._designOld!)) {
      this.updateForm();
    }
    this._designOld = <Design>{...this._design};
  }

  private hasChanged(_design: Design, _designOld: Design): boolean {
    return !(
      this._design?.content == this._designOld?.content &&
      this._design?.fontSize == this._designOld?.fontSize &&
      this._design?.textAlign == this._designOld?.textAlign &&
      this._design?.top == this._designOld?.top &&
      this._design?.left == this._designOld?.left &&
      this._design?.width == this._designOld?.width &&
      this._design?.height == this._designOld?.height
    );
  }
}
