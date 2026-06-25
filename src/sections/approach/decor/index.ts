import StrategyDecor from "./StrategyDecor";
import DesignDecor from "./DesignDecor";
import MotionDecor from "./MotionDecor";
import ShipDecor from "./ShipDecor";
import type { DecorProps } from "./shared";

export const approachDecor: Array<(props: DecorProps) => React.JSX.Element> = [
  StrategyDecor,
  DesignDecor,
  MotionDecor,
  ShipDecor,
];
