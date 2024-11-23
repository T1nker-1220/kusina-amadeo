import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

const products = [
  // Budget Meals
  {
    name: "Hotsilog",
    description: "Hotdog with Sinangag (Fried Rice) and Itlog (Egg)",
    price: 60,
    category: "Budget Meals",
    productId: "hotsilog",
    image: "/images/products/hotsilog.jpg"
  },
  {
    name: "Hamsilog",
    description: "Ham with Sinangag (Fried Rice) and Itlog (Egg)",
    price: 55,
    category: "Budget Meals",
    productId: "hamsilog",
    image: "/images/products/hamsilog.jpg"
  },
  {
    name: "Silog",
    description: "Sinangag (Fried Rice) and Itlog (Egg)",
    price: 35,
    category: "Budget Meals",
    productId: "silog",
    image: "/images/products/silog.jpg"
  },
  {
    name: "Skinless Rice",
    description: "Skinless Longganisa with Fried Rice",
    price: 40,
    category: "Budget Meals",
    productId: "skinless",
    image: "/images/products/skinless.jpg"
  },
  {
    name: "Pork Chaofan",
    description: "Pork Fried Rice Chinese Style",
    price: 45,
    category: "Budget Meals",
    productId: "pork-chaofan",
    image: "/images/products/pork-chaofan.jpg",
    addons: [
      { name: "Siomai", price: 5 },
      { name: "Shanghai", price: 5 },
      { name: "Skinless", price: 10 },
      { name: "Egg", price: 15 },
    ],
  },
  {
    name: "Beef Chaofan",
    description: "Beef Fried Rice Chinese Style",
    price: 50,
    category: "Budget Meals",
    productId: "beef-chaofan",
    image: "/images/products/beef-chaofan.jpg",
    addons: [
      { name: "Siomai", price: 5 },
      { name: "Shanghai", price: 5 },
      { name: "Skinless", price: 10 },
      { name: "Egg", price: 15 },
    ],
  },
  {
    name: "Siomai Rice",
    description: "Siomai with Fried Rice",
    price: 39,
    category: "Budget Meals",
    productId: "siomai-rice",
    image: "/images/products/siomai-rice.jpg"
  },
  {
    name: "Shanghai Rice",
    description: "Lumpia Shanghai with Rice",
    price: 39,
    category: "Budget Meals",
    productId: "shanghai-rice",
    image: "/images/products/shanghai-rice.jpg"
  },
  // Silog Meals
  {
    name: "Tapsilog",
    description: "Beef Tapa with Sinangag and Itlog",
    price: 100,
    category: "Silog Meals",
    productId: "tapsilog",
    image: "/images/products/tapasilog.jpg"
  },
  {
    name: "Porksilog",
    description: "Porkchop with Sinangag and Itlog",
    price: 95,
    category: "Silog Meals",
    productId: "porksilog",
    image: "/images/products/porksilog.jpg"
  },
  {
    name: "Chicksilog",
    description: "Chicken with Sinangag and Itlog",
    price: 95,
    category: "Silog Meals",
    productId: "chicksilog",
    image: "/images/products/chicksilog.jpg"
  },
  {
    name: "Bangsilog",
    description: "Bangus with Sinangag and Itlog",
    price: 100,
    category: "Silog Meals",
    productId: "bangsilog",
    image: "/images/products/bangsilog.jpg"
  },
  {
    name: "Sisigsilog",
    description: "Sisig with Sinangag and Itlog",
    price: 95,
    category: "Silog Meals",
    productId: "sisigsilog",
    image: "/images/products/sisigsilog.jpg"
  },
  {
    name: "Tocilog",
    description: "Tocino with Sinangag and Itlog",
    price: 85,
    category: "Silog Meals",
    productId: "tocilog",
    image: "/images/products/tocilog.jpg"
  },
  // Ala Carte
  {
    name: "Lugaw",
    description: "Filipino Rice Porridge",
    price: 20,
    category: "Ala Carte",
    productId: "lugaw",
    image: "/images/products/lugaw.jpg"
  },
  {
    name: "Goto",
    description: "Rice Porridge with Beef Tripe",
    price: 35,
    category: "Ala Carte",
    productId: "goto",
    image: "/images/products/goto.jpg"
  },
  {
    name: "Beef Mami",
    description: "Beef Noodle Soup",
    price: 45,
    category: "Ala Carte",
    productId: "beef-mami",
    image: "/images/products/beef-mami.jpg"
  },
  {
    name: "Pares",
    description: "Beef Stew with Rice",
    price: 60,
    category: "Ala Carte",
    productId: "pares",
    image: "/images/products/pares.jpg"
  },
  {
    name: "Fries",
    description: "Crispy French Fries",
    price: 25,
    category: "Ala Carte",
    productId: "fries",
    image: "/images/products/fries.jpg"
  },
  {
    name: "Waffle",
    description: "Fresh Baked Waffle",
    price: 15,
    category: "Ala Carte",
    productId: "waffle",
    image: "/images/products/waffle.jpg",
    variants: ["Chocolate", "Cheese", "Hotdog"]
  },
  {
    name: "Graham Bar",
    description: "Graham Cracker Dessert Bar",
    price: 20,
    category: "Ala Carte",
    productId: "graham-bar",
    image: "/images/products/grahambar.jpg"
  },
  {
    name: "Cheese Stick",
    description: "Crispy Cheese Stick (6 pieces per order)",
    price: 10,
    category: "Ala Carte",
    productId: "cheesetick",
    image: "/images/products/cheesetick.jpg"
  },
  {
    name: "Siomai",
    description: "Chinese-style Siomai",
    price: 5,
    category: "Ala Carte",
    productId: "siomai-piece",
    image: "/images/products/siomai-rice.jpg",
    variants: ["Chicken", "Beef"]
  },
  // Beverages
  {
    name: "Coke Float",
    description: "Coca-Cola with Ice Cream",
    price: 29,
    category: "Beverages",
    productId: "coke-float",
    image: "/images/products/coke-float.jpg"
  },
  {
    name: "Iced Coffee",
    description: "Cold Brewed Coffee with Ice (22oz)",
    price: 29,
    category: "Beverages",
    productId: "iced-coffee",
    image: "/images/products/iced-coffee.jpg"
  },
  {
    name: "Fruit Soda 16oz",
    description: "Refreshing Fruit-flavored Soda",
    price: 29,
    category: "Beverages",
    productId: "fruit-soda-16",
    image: "/images/products/16oz-fruits.jpg",
    variants: ["Blueberry", "Strawberry", "Lemon", "Green Apple"]
  },
  {
    name: "Fruit Soda 22oz",
    description: "Large Refreshing Fruit-flavored Soda",
    price: 39,
    category: "Beverages",
    productId: "fruit-soda-22",
    image: "/images/products/22ozfruitsoda.jpg",
    variants: ["Blueberry", "Strawberry", "Lemonade", "Green Apple"]
  },
];

async function seedProducts() {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Insert new products
    await Product.insertMany(products);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedProducts();
