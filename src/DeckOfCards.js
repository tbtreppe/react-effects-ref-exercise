import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Card from "./Card";

const API_BASE_URL = "http://deckofcardsapi.com/api/deck";

function DeckOfCards() {
  const [deck, setDeck] = useState(null);
  const [drawn, setDrawn] = useState([]);
  const [autoDraw, setAutoDraw] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    async function getData() {
      const d = await axios.get(`${API_BASE_URL}/new/shuffle/`);
      setDeck(d.data);
    }
    getData();
  }, [setDeck]);

  useEffect(() => {
    async function getCard() {
      let { deck_id } = deck;

      try {
        const drawRes = await axios.get(`${API_BASE_URL}/${deck_id}/draw/`);
        if (drawRes.data.remaining === 0) {
          setAutoDraw(false);
          throw new Error("no cards remaining");
        }
        const card = drawRes.data.cards[0];
        setDrawn((d) => [
          ...d,
          {
            id: card.code,
            name: card.suit + " " + card.value,
            image: card.image,
          },
        ]);
      } catch (err) {
        alert(err);
      }
    }
    if (autoDraw && !timerRef.current) {
      timerRef.current = setInterval(async () => {
        await getCard();
      }, 1000);
    }
    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [autoDraw, setAutoDraw, deck]);

  const toggleAutoDraw = () => {
    setAutoDraw((auto) => !auto);
  };

  const cards = drawn.map((c) => (
    <Card key={c.id} name={c.name} image={c.image} />
  ));

  return (
    <div className="Deck">
      {deck ? (
        <button className="Deck-give" onClick={toggleAutoDraw}>
          {autoDraw ? "STOP" : "KEEP"} DRAWING
        </button>
      ) : null}{" "}
      {cards}
    </div>
  );
}

export default DeckOfCards;
