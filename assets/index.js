// Central place to import every local image asset from.
// Keeping these in one file means screens/components never need to
// know the actual file names on disk.

export const images = {
  logo: require('./logo.png'),
  heroImage: require('./hero-image.png'),
  avatarPlaceholder: require('./avatar-placeholder.png'),
  deliveryVan: require('./delivery-van.png'),
  greekSalad: require('./greek-salad.png'),
  bruschetta: require('./bruschetta.png'),
  grilledFish: require('./grilled-fish.png'),
  pasta: require('./pasta.png'),
  lemonDessert: require('./lemon-dessert.png'),
};

export default images;
