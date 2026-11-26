import { useState } from "react";
import { SearchIcon } from "./Icons";

const KEY = import.meta.env.GOOGLE_MAPS_API_KEY;

const query = (place: string) => `flu jab near ${place.trim() || "me"}`;
const embedUrl = (place: string) =>
  `https://www.google.com/maps/embed/v1/search?key=${encodeURIComponent(KEY ?? "")}&q=${encodeURIComponent(query(place))}`;
const mapsUrl = (place: string) => `https://www.google.com/maps/search/${encodeURIComponent(query(place))}`;

/**
 * Postcode search plus a Google Maps Embed of nearby flu jab services.
 * Google isn't contacted until the visitor searches or asks for the map, so no cookie banner is needed
 * before then. Without GOOGLE_MAPS_API_KEY the search opens Google Maps in a new tab instead.
 */
export function FluJabMap() {
  const [input, setInput] = useState("");
  const [place, setPlace] = useState<string | null>(null);

  return (
    <div className="map">
      <form
        className="map__search"
        onSubmit={(e) => {
          e.preventDefault();
          if (KEY) setPlace(input);
          else window.open(mapsUrl(input), "_blank", "noopener");
        }}
      >
        <label className="search map__field">
          <input
            type="text"
            inputMode="text"
            autoComplete="postal-code"
            placeholder="Enter your postcode or town"
            aria-label="Postcode or town"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <SearchIcon />
        </label>
        <button className="btn" type="submit">Find a flu jab</button>
      </form>

      <div className="map__frame">
        {KEY && place !== null ? (
          <iframe
            key={place}
            title={`Map of ${query(place)}`}
            src={embedUrl(place)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <div className="map__gate">
            <p>
              {KEY
                ? "Search above, or show the map of flu jab services near you. The map is provided by Google."
                : "Search above to see flu jab services near you on Google Maps."}
            </p>
            {KEY ? (
              <button className="text-link map__show" type="button" onClick={() => setPlace(input)}>
                Show the map
              </button>
            ) : (
              <a className="text-link" href={mapsUrl(input)} target="_blank" rel="noreferrer">
                Open Google Maps
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
