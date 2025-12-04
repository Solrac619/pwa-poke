import { useEffect, useState } from "react";

export default function Home() {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=30");
      const data = await res.json();

      const list = await Promise.all(
        data.results.map(async (p) => {
          const d = await fetch(p.url).then((r) => r.json());
          return {
            name: p.name,
            image: d.sprites.front_default
          };
        })
      );

      setPokemons(list);
    }
    load();
  }, []);

  return (
    <div>
      <h1>Pokemons</h1>
      <div className="grid">
        {pokemons.map((p) => (
          <div
            key={p.name}
            className="card"
            onClick={() => {
              if (Notification.permission !== "granted") {
                Notification.requestPermission();
              }
              new Notification(`Has seleccionado a ${p.name}`);
            }}
          >
            <img src={p.image} alt={p.name} />
            <p>{p.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
