/**
 * Classe d'utilitaires
 */
export class Utils {

  /**
   * Arrondi à 0.5 le plus proche
   * @param value Valeur à arrondir
   */
  public static roundPixel(value: number): number {
    return Math.round(value*2)/2
  }
}
