import React, { useEffect, useState } from "react";
import axios from "axios";
import "./pokedex.css";
import "bootstrap/dist/css/bootstrap.min.css";

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonDetails {
  types: { type: { name: string } }[];
  moves: { move: { name: string } }[];
}

const Pokedex: React.FC = () => {
  const [data, setData] = useState<Pokemon[]>([]);
  const [generation, setGeneration] = useState(0);
  const [inicioLimite, setInicioLimite] = useState(0);
  const [limit, setLimit] = useState(151);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails | null>(null);
  const [typeIcon, setTypeIcon] = useState<string | null>(null); // Estado para almacenar el icono del tipo

  const generations = [
    { offset: 0, limit: 151, name: "Primera" },
    { offset: 151, limit: 100, name: "Segunda" },
    { offset: 251, limit: 135, name: "Tercera" },
    { offset: 386, limit: 107, name: "Cuarta" },
    { offset: 493, limit: 156, name: "Quinta" },
  ];

  const obtenerPokemons = async (inicio: number, limite: number) => {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?offset=${inicio}&limit=${limite}`
      );
      const json = response.data.results;
      setData(json);
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerDetallesPokemon = async (url: string) => {
    try {
      const response = await axios.get(url);
      const json = response.data;
      setPokemonDetails({
        types: json.types,
        moves: json.moves.slice(0, 5), // Limitar a los primeros 5 movimientos
      });

      // Obtener el icono del tipo primario (asumiendo que siempre hay al menos un tipo)
      const typeUrl = `https://www.serebii.net/pokedex-bw/type/${json.types[0].type.name}.gif`;
      setTypeIcon(typeUrl);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    obtenerPokemons(inicioLimite, limit);
  }, [inicioLimite, limit]);

  const handleGenerationChange = (index: number) => {
    setGeneration(index);
    setInicioLimite(generations[index].offset);
    setLimit(generations[index].limit);
  };

  const openPokemonModal = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    obtenerDetallesPokemon(pokemon.url);
  };

  const closeModal = () => {
    setSelectedPokemon(null);
    setPokemonDetails(null);
    setTypeIcon(null);
  };
  
  return (
    <div className="container">
      <h1 className="text-center my-4">Pokédex</h1>
      <div className="btn-group mb-4" role="group" aria-label="Generations">
        {generations.map((gen, index) => (
          <button
            key={index}
            type="button"
            className={`btn btn-primary ${
              generation === index ? "active" : ""
            }`}
            onClick={() => handleGenerationChange(index)}
          >
            {gen.name}
          </button>
        ))}
      </div>
      <div className="row">
        {data.map((item) => {
          const ruta = item.url;
          const pock = ruta.split("/");
          const id = pock[6];
          const urlP = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

          return (
            <div className="col-md-4 mb-4" key={id}>
              <div
                className="card"
                style={{ cursor: "pointer" }}
                onClick={() => openPokemonModal(item)}
              >
                <img
                  className="card-img-top"
                  src={urlP}
                  alt={`Sprite de ${item.name}`}
                />
                <div className="card-body">
                  <h5 className="card-title">PokeName: {item.name}</h5>
                  <p className="card-text">ID: {id}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal para mostrar la información del Pokémon */}
      {selectedPokemon && (
        <div
          className="modal fade show"
          id="exampleModal"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  {selectedPokemon.name}
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={closeModal}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${selectedPokemon.url.split(
                    "/"
                  )[6]}.png`}
                  alt={`Imagen de ${selectedPokemon.name}`}
                  className="img-fluid"
                />
                {pokemonDetails ? (
                  <>
                    <h6>Tipos:</h6>
                    <ul>
                      {pokemonDetails.types.map((type, index) => (
                        <li key={index}>
                          <img
                            src={`https://www.serebii.net/pokedex-bw/type/${type.type.name}.gif`}
                            alt={`Icono de tipo ${type.type.name}`}
                          />{" "}
                          {type.type.name}
                        </li>
                      ))}
                    </ul>
                    <h6>Movimientos:</h6>
                    <ul>
                      {pokemonDetails.moves.map((move, index) => (
                        <li key={index}>{move.move.name}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p>Cargando detalles...</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={closeModal}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pokedex;
