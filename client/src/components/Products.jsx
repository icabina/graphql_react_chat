import { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSort = () => {
    setProducts(products.sort((a, b) => a.price - b.price));
  };

  useEffect(() => {
    fetch("https//:fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => {
        console.log({ error: err });
      })
      .finally(setLoading(!loading));
  }, []);

  if (!loading) return <h2>Loading....</h2>;

  return (
    <>
      {loading && (
        <>
          <ul>
            {products.map((p) => (
              <li key={p.id}>
                <img src={p.image} alt={p.name} />
                <h3>{p.name}</h3>
                <p>{p.price}</p>
              </li>
            ))}
          </ul>
          <button onClick={handleSort}>Sort by price</button>
        </>
      )}
    </>
  );
}
