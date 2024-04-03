/**
 * Contient les informations des champs personnalisés
 */
export interface CalculatedField {
  name: string,
  type: 'number' | 'string' | 'date' | 'today-date' | 'dropdown',
  used: boolean,
  preference?: any,
  options?: { id: string, name: string }[]
}
