import {Component, DoCheck, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {CommonField} from "../../fields/common-field/common-field";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, merge, Subscription} from "rxjs";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatIcon} from "@angular/material/icon";
import {LabelFieldPersonalizationComponent} from "../label-field-personalization/label-field-personalization.component";
import {ImageFieldPersonalizationComponent} from "../image-field-personalization/image-field-personalization.component";
import {FieldPersonalization} from "./field-personalization";
import {MatIconButton} from "@angular/material/button";
import {FieldService} from "../../field-service/field.service";
import {PAGE_HEIGHT, PAGE_WIDTH} from "../../dimensions";
import {Utils} from "../../utils";

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
    ImageFieldPersonalizationComponent,
    MatIconButton
  ],
  templateUrl: './common-field-personalization.component.html',
  styleUrl: './common-field-personalization.component.scss'
})
export class CommonFieldPersonalizationComponent implements OnInit, DoCheck, OnDestroy {

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
  private valueChangesSubscription?: Subscription;

  protected form: FormGroup = new FormGroup({
    child: new FormGroup({}),
    top: new FormControl(0),
    left: new FormControl(0),
    bottom: new FormControl(0),
    right: new FormControl(0),
    width: new FormControl(0),
    height: new FormControl(0),
  });

  constructor(private fieldService: FieldService) {}

  /**
   * Lors de la création du composant, souscription au changement de valeur des champs de formulaire
   */
  public ngOnInit(): void {
    this.form.get('bottom')?.disable({ emitEvent: false });
    this.form.get('right')?.disable({ emitEvent: false });

    this.valueChangesSubscription = merge(
      this.form.get('top')!.valueChanges,
      this.form.get('left')!.valueChanges,
      this.form.get('width')!.valueChanges,
      this.form.get('height')!.valueChanges,
      this.form.get('child')!.valueChanges,
    ).pipe(debounceTime(100)).subscribe(() => {
      this.updateContent();
    });
  }

  /**
   * Se désabonne de la souscription
   */
  public ngOnDestroy(): void {
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }
  }

  /**
   * Vérifie si l'interface a changé de valeurs et modifie le formulaire en conséquence
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
   * Désélectionne l'élément courant pour afficher le menu de création
   */
  protected goToCreationMenu(): void {
    this.fieldService.unSelectCurrent();
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
    newField.top = Utils.roundPixel(this.form.get('top')!.value);
    newField.left = Utils.roundPixel(this.form.get('left')!.value);
    newField.width = Utils.roundPixel(this.form.get('width')!.value);
    newField.height = Utils.roundPixel(this.form.get('height')!.value);
    this.fieldChange.emit(newField);
    this.calculatedField();
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
    this.calculatedField();
  }

  /**
   * Met à jour les champs calculés
   */
  private calculatedField(): void {
    this.form.get('bottom')!.setValue(PAGE_HEIGHT - (this.form.get('top')?.value + this.form.get('height')?.value), {emitEvent: false})
    this.form.get('right')!.setValue(PAGE_WIDTH - (this.form.get('left')?.value + this.form.get('width')?.value), {emitEvent: false})
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

  /**
   * Centre l'élément dans la page
   */
  protected center(): void {
    this.form.get('top')!.setValue(Utils.roundPixel((PAGE_HEIGHT - this.form.get('height')!.value)/2), { emitEvent: true });
    this.form.get('left')!.setValue(Utils.roundPixel((PAGE_WIDTH - this.form.get('width')!.value)/2), { emitEvent: true });
  }
}
