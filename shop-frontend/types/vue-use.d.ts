declare module '@vueuse/core' {
  //UseMouseInElement
  export interface MouseInElementOptions extends UseMouseOptions {
    handleOutside?: boolean;
  }
  /**
   * Reactive mouse position related to an element.
   *
   * @see https://vueuse.org/useMouseInElement
   * @param target
   * @param options
   */
  export declare function useMouseInElement(
    target?: MaybeElementRef,
    options?: MouseInElementOptions,
  ): {
    x: Ref<number>;
    y: Ref<number>;
    sourceType: Ref<UseMouseSourceType>;
    elementX: Ref<number>;
    elementY: Ref<number>;
    elementPositionX: Ref<number>;
    elementPositionY: Ref<number>;
    elementHeight: Ref<number>;
    elementWidth: Ref<number>;
    isOutside: Ref<boolean>;
    stop: () => void;
  };
  export type UseMouseInElementReturn = ReturnType<typeof useMouseInElement>;

  //UseIntervalFn
  export interface UseIntervalFnOptions {
    /**
     * Start the timer immediately
     *
     * @default true
     */
    immediate?: boolean;
    /**
     * Execute the callback immediate after calling this function
     *
     * @default false
     */
    immediateCallback?: boolean;
  }
  /**
   * Wrapper for `setInterval` with controls
   *
   * @param cb
   * @param interval
   * @param options
   */
  export declare function useIntervalFn(cb: Fn, interval?: MaybeComputedRef<number>, options?: UseIntervalFnOptions): Pausable;

  //debounce
  /**
   * Debounce execution of a function.
   *
   * @see https://vueuse.org/useDebounceFn
   * @param  fn          A function to be executed after delay milliseconds debounced.
   * @param  ms          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
   * @param  options     Options
   *
   * @return A new, debounce, function.
   */
  export declare function useDebounceFn<T extends FunctionArgs>(
    fn: T,
    ms?: MaybeRefOrGetter<number>,
    options?: DebounceFilterOptions,
  ): PromisifyFn<T>;
}
