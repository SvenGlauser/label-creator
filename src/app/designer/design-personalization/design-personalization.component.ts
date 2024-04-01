import {Component, DoCheck, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Design} from "../design";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {debounceTime} from "rxjs";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatIcon} from "@angular/material/icon";
import {
  DesignLabelPersonalizationComponent
} from "./design-label-personalization/design-label-personalization.component";
import {
  DesignImagePersonalizationComponent
} from "./design-image-personalization/design-image-personalization.component";
import {DesignPersonalization} from "./design-personalization";

@Component({
  selector: 'app-design-personalization',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatIcon,
    DesignLabelPersonalizationComponent,
    DesignImagePersonalizationComponent
  ],
  templateUrl: './design-personalization.component.html',
  styleUrl: './design-personalization.component.scss'
})
export class DesignPersonalizationComponent implements OnInit, DoCheck {

  protected _design?: Design;
  private _designOld?: Design;
  @Input() set design(value: Design) {
    this._design = value;
  }
  @Output()
  public designChange = new EventEmitter<Design>();

  @ViewChild('child')
  public child?: DesignPersonalization;

  private cancelNextUpdate = false;

  protected form: FormGroup = new FormGroup({
    child: new FormGroup({}),
    top: new FormControl(0),
    left: new FormControl(0),
    width: new FormControl(0),
    height: new FormControl(0),
  });

  private updateForm(): void {
    if (this.child) {
      this.child.updateForm(this._design!)
    }
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
      let newDesign: Design = this.child!.getNew(this._design!);
      newDesign.top = Number.parseInt(this.form.get('top')!.value);
      newDesign.left = Number.parseInt(this.form.get('left')!.value);
      newDesign.width = Number.parseInt(this.form.get('width')!.value);
      newDesign.height = Number.parseInt(this.form.get('height')!.value);
      this.designChange.emit(newDesign);
    });
  }

  public ngDoCheck(): void {
    if (!this.child) {
      setTimeout(() => this.updateForm(), 100);
    }
    if (this.hasChanged(this._design!, this._designOld!)) {
      this.updateForm();
    }
    this._designOld = <Design>{...this._design};
  }

  private hasChanged(_design: Design, _designOld: Design): boolean {
    return this.child?.hasChanged(_design, _designOld) || !(
      _design?.top == _designOld?.top &&
      _design?.left == _designOld?.left &&
      _design?.width == _designOld?.width &&
      _design?.height == _designOld?.height
    );
  }

  public getChildForm(): AbstractControl {
    return this.form.get('child')!;
  }
}
