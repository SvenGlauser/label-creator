/**
 * Interface pour les champs textes classiques
 */
export interface LabelField extends CommonField {
  content: string;
  fontSize: number;
  fontFamily: string;
  textAlign: 'center' | 'left' | 'right' | 'justify';
  verticalTextAlign: 'center' | 'flex-end' | 'flex-start';
  color: string;
  backgroundColor: string;
}
