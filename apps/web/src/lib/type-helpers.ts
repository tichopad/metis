/**
 * Helper type for shaping an event with a currentTarget
 */
export type TargetedEvent<TEvent, TElement = any> = TEvent & {
	currentTarget: EventTarget & TElement;
};

/**
 * Helper type for shaping an event handler
 */
export type EventHandler<TEvent, TElement = any> = (event: TargetedEvent<TEvent, TElement>) => void;
