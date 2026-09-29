import images from '../assets';

// Sample menu data for the Home screen. In the real Little Lemon
// capstone this would come from the Meta API / a local SQLite cache,
// but a static list is enough to demonstrate filtering, search and
// the "summarized view of menu items" the rubric asks for.
export const CATEGORIES = ['Starters', 'Mains', 'Desserts'];

export const MENU_ITEMS = [
  {
    id: '1',
    name: 'Greek Salad',
    category: 'Starters',
    price: 12.99,
    description:
      'The famous Greek salad of crispy lettuce, peppers, olives and feta, served with our house-made dressing.',
    image: images.greekSalad,
  },
  {
    id: '2',
    name: 'Bruschetta',
    category: 'Starters',
    price: 7.99,
    description:
      'Toasted bread topped with fresh diced tomato, garlic, basil and a drizzle of olive oil.',
    image: images.bruschetta,
  },
  {
    id: '3',
    name: 'Grilled Fish',
    category: 'Mains',
    price: 20.0,
    description:
      'Fresh fish grilled over an open flame, served with seasonal vegetables and roast potatoes.',
    image: images.grilledFish,
  },
  {
    id: '4',
    name: 'Pasta',
    category: 'Mains',
    price: 18.99,
    description:
      'Penne tossed in a rich, spiced tomato sauce with fresh basil and a hint of chilli.',
    image: images.pasta,
  },
  {
    id: '5',
    name: 'Lemon Dessert',
    category: 'Desserts',
    price: 6.99,
    description:
      "Our famous lemon layer cake, a family recipe passed down from Little Lemon's grandmother.",
    image: images.lemonDessert,
  },
];
