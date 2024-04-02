import {
  AfterContentInit,
  AfterViewInit,
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {CommonField} from "../../fields/common-field/common-field";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {debounceTime} from "rxjs";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatIcon} from "@angular/material/icon";
import {
  LabelFieldPersonalizationComponent
} from "../label-field-personalization/label-field-personalization.component";
import {
  ImageFieldPersonalizationComponent
} from "../image-field-personalization/image-field-personalization.component";
import {FieldPersonalization} from "./field-personalization";

/**
 * Composant parent pour la personnalisation des champs
 */
@Component({
  selector: 'app-common-field-personalization',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatIcon,
    LabelFieldPersonalizationComponent,
    ImageFieldPersonalizationComponent
  ],
  templateUrl: './common-field-personalization.component.html',
  styleUrl: './common-field-personalization.component.scss'
})
export class CommonFieldPersonalizationComponent implements OnInit, DoCheck {

  @Input('field')
  public set setField(value: CommonField) {
    this.field = value;
  }
  @Output()
  public fieldChange = new EventEmitter<CommonField>();
  protected field?: CommonField;

  @ViewChild('child')
  private child?: FieldPersonalization;

  private oldField?: CommonField;
  private initializedChild = false;

  protected form: FormGroup = new FormGroup({
    child: new FormGroup({}),
    top: new FormControl(0),
    left: new FormControl(0),
    width: new FormControl(0),
    height: new FormControl(0),
  });

  /**
   * Lors de la création du composant, souscription au changement de valeur des champs de formulaire
   */
  public ngOnInit(): void {
    this.form.valueChanges.pipe(debounceTime(100)).subscribe((changes) => {
      this.updateContent();
    });
  }

  /**
   * Vérifie si l'interface a changée de valeurs et modifie le formulaire en conséquence
   */
  public ngDoCheck(): void {
    if (this.hasChanged()) {
      this.updateForm();
    } else if (!this.initializedChild && this.child) {
      this.child.updateForm(this.field!);
      this.initializedChild = true;
    }
  }

  /**
   * Récupère le formulaire enfant
   */
  protected getChildForm(): AbstractControl {
    return this.form.get('child')!;
  }

  /**
   * Met à jour le champ affiché à l'écran
   */
  private updateContent(): void {
    let newField: CommonField = this.child!.getNew(this.field!);
    newField.top = Number.parseInt(this.form.get('top')!.value);
    newField.left = Number.parseInt(this.form.get('left')!.value);
    newField.width = Number.parseInt(this.form.get('width')!.value);
    newField.height = Number.parseInt(this.form.get('height')!.value);
    this.fieldChange.emit(newField);
  }

  /**
   * Met à jour les champs de formulaire et ceux du formulaire enfant
   */
  private updateForm(): void {
    if (this.child) {
      this.child.updateForm(this.field!)
    }
    this.form.get('top')!.setValue(this.field?.top, { emitEvent: false })
    this.form.get('left')!.setValue(this.field?.left, { emitEvent: false })
    this.form.get('width')!.setValue(this.field?.width, { emitEvent: false })
    this.form.get('height')!.setValue(this.field?.height, { emitEvent: false })
    this.oldField = <CommonField>{...this.field};
  }

  /**
   * Vérifie si le champ a changé de valeur
   */
  private hasChanged(): boolean {
    if (this.field && this.oldField) {
      return this.child?.hasChanged(this.field, this.oldField) || !(
        this.field.top == this.oldField.top &&
        this.field.left == this.oldField.left &&
        this.field.width == this.oldField.width &&
        this.field.width == this.oldField.width &&
        this.field.height == this.oldField.height
      );
    }
    return !!this.field;
  }
}
