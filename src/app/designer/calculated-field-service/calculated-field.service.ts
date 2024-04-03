import {Injectable} from '@angular/core';
import {CalculatedField} from "../calculated-fields/calculated-field";
import {LabelField} from "../fields/label-field/label-field";
import {CommonField} from "../fields/common-field/common-field";

/**
 * Service gérant les champs personnalisés/calculés
 */
@Injectable({
  providedIn: 'root'
})
export class CalculatedFieldService {

  private calculatedFields: CalculatedField[] = [];

  public refreshCalculatedFields(fields: CommonField[]): void {
    const sortedFields = fields.filter(field => field.type == 'label');

    this.calculatedFields.forEach(calculatedField => calculatedField.used = false);

    for (const field of sortedFields) {
      let occurrences = (<LabelField>field).content.matchAll(/#(.*?)#/g);
      for (const occurrence of occurrences) {
        const index = this.calculatedFields.findIndex(field => field.name == occurrence[1]);

        if (index == -1) {
          this.calculatedFields.push({
            name: occurrence[1],
            type: 'string',
            used: true,
          })
        } else {
          this.calculatedFields[index].used = true;
        }
      }
    }
  }

  public getAllCalculatedFields(): CalculatedField[] {
    return this.calculatedFields.filter(calculatedField => calculatedField.used);
  }
}
