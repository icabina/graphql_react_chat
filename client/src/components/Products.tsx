import React, { useEffect, useState, ChangeEvent } from "react";

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://fakestoreapi.com/products");
        const data = await res.json();
        setProducts(data);

        const unique: string[] = Array.from(
          new Set(data.map((p: Product) => p.category)),
        );
        setCategories(unique);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleSort = () => {
    const sorted = [...products].sort((a, b) => a.price - b.price);
    setProducts(sorted);
  };

  const sortedProducts =
    category === "all"
      ? products
      : products.filter((p) => p.category === category);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="products">
      <h1 style={{ color: "#000" }}>Fake store products</h1>
      <div className="row">
        <select
          value={category}
          onChange={handleCategoryChange}
          style={{ width: "300px" }}
        >
          <option value="all">All</option>
          {categories.map((c: string) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button onClick={handleSort}>Sort</button>
      </div>
      <ul>
        {sortedProducts.map((p) => (
          <li key={p.id} style={{}}>
            <img src={p.image} width="100" />
            <h4>{p.title}</h4>
            <p>${p.price}</p>
            <p>{p.category}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
