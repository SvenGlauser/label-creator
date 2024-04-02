import {CommonField} from "../common-field/common-field";

/**
 * Interface pour les champs contenant des images
 */
export interface ImageField extends CommonField {
  image?: File;
  imageUrl?: string;
  backgroundSize: '' | 'contain' | 'cover';
}

/**
 * Interface pour les champs contenant des images lors de l'exportation en JSON
 */
export interface ImageFieldExportable extends CommonField {
  image?: string;
  imageName?: string;
  imageUrl?: string;
  backgroundSize: '' | 'contain' | 'cover';
}
