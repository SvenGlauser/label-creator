import {DesignCommonDirective} from "./design-common/design-common.directive";

export interface Design {
  name: string;
  type: 'label';
  content: string;
  textAlign: 'center' | 'left' | 'right' | 'justify';

  top: number;
  left: number;
  height: number;
  width: number;
  align: 'none' | 'center' | 'left' | 'right';

  linkedDirective: DesignCommonDirective | undefined;
}
