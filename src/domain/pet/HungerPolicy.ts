export class HungerPolicy {
  public static readonly SAFE_MIN_HUNGER = 20; // Safe lower bound: never dies or starves
  public static readonly MAX_HUNGER = 100;
  public static readonly FEED_RESTORE_AMOUNT = 25;
  public static readonly FEED_HAPPINESS_GAIN = 15;
  public static readonly FEED_ENERGY_GAIN = 10;
  public static readonly FEED_XP_GAIN = 10;

  /**
   * Applies non-punitive natural decay with safe lower bound clamp.
   * Absence for multiple days never drops below SAFE_MIN_HUNGER.
   */
  public static calculateNaturalDecay(currentHunger: number, hoursSinceLastFed: number): number {
    const decay = Math.floor(hoursSinceLastFed * 1.5);
    return Math.max(HungerPolicy.SAFE_MIN_HUNGER, currentHunger - decay);
  }

  /**
   * Applies feeding restoration
   */
  public static feed(currentHunger: number, foodAmount = 1): number {
    return Math.min(
      HungerPolicy.MAX_HUNGER,
      currentHunger + HungerPolicy.FEED_RESTORE_AMOUNT * foodAmount
    );
  }
}
