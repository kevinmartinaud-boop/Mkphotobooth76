import React, { useState } from "react";

// PhotoboothLanding.jsx
// Single-file React component (Tailwind classes). Default export a component you can drop in a React app.

export default function PhotoboothLanding() {
  const rouen = { lat: 49.4431, lon: 1.0993 };

  const packages = [
    { id: 1, title: "Formule 1 (numérique)", price: 150, prints: 0 },
    { id: 2, title: "Formule 2", price: 200, prints: 150 },
    { id: 3, title: "Formule 3", price: 300, prints: 300 },
    { id: 4, title: "Formule 4", price: 400, prints: 450 }
  ];

  const [selected, setSelected] = useState(packages[0].id);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [userPos, setUserPos] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);
  const [message, setMessage] = useState("");
  const [showIntermediate, setShowIntermediate] = useState(false);

  function haversine(lat1, lon1, lat2, lon2) {
    // returns distance in kilometers
    function toRad(x) { return x * Math.PI / 180; }
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  function checkDistance() {
    if (!navigator.geolocation) {
      setMessage("Géolocalisation non supportée par votre navigateur.");
      return;
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      setUserPos({ lat, lon });
      const d = haversine(lat, lon, rouen.lat, rouen.lon);
      setDistanceKm(d.toFixed(1));
      if (d <= 30) setMessage("Vous êtes dans la zone de livraison gratuite (30 km autour de Rouen).");
      else setMessage("Hors zone : des frais de déplacement pourront être ajoutés. Contactez-nous.");
    }, (err) => {
      setMessage("Impossible d'obtenir votre position : autorisation refusée ou erreur.");
    });
  }

  function submitReservation(e) {
    e.preventDefault();
    // No backend: create a mailto link so the user can send a reservation email from their client.
    const pack = packages.find(p => p.id === selected);
    const subject = encodeURIComponent(`Réservation Photobooth - ${pack.title}`);
    const body = encodeURIComponent(
      `Bonjour,%0A%0AJe souhaite réserver : %0A- Nom : ${name}%0A- Email : ${email}%0A- Téléphone : ${phone}%0A- Date : ${date}%0A- Formule : ${pack.title} (${pack.price} €, ${pack.prints} tirages)%0A- Position : ${userPos ? `${userPos.lat}, ${userPos.lon} (à ${distanceKm} km de Rouen)` : 'non fournie'}%0A%0AMerci !`
    );
    window.location.href = `mailto:contact@votrephotobooth.fr?subject=${subject}&body=${body}`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 p-6">
      <header className="max-w-5xl mx-auto mb-8">
        <h1 className="text-4xl font-extrabold">Location de Photobooth</h1>
        <p className="mt-2 text-gray-700">Livraison, installation et reprise gratuites dans un rayon d'environ 30 km de Rouen.</p>
      </header>

      <main className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2">
        <section className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-2xl font-semibold">Nos formules</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {packages.map(p => (
                <div key={p.id} className="border rounded-xl p-4">
                  <h3 className="font-bold">{p.title}</h3>
                  <p className="mt-2 text-lg">{p.price} €</p>
                  <p className="text-sm mt-1">{p.prints > 0 ? `${p.prints} tirages inclus` : 'Numérique seulement'}</p>
                  <button onClick={() => setSelected(p.id)} className={`mt-3 px-3 py-2 rounded-lg border ${selected===p.id? 'bg-black text-white' : ''}`}>Choisir</button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-2xl font-semibold">Géolocalisation & zone de livraison</h2>
            <p className="mt-2 text-gray-600">Cliquez pour vérifier si vous êtes dans la zone (30 km autour de Rouen).</p>
            <div className="mt-4 flex items-center gap-3">
              <button onClick={checkDistance} className="px-4 py-2 rounded-lg border">Vérifier ma position</button>
              {distanceKm && <span className="text-sm">Distance : {distanceKm} km</span>}
            </div>
            {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
            <div className="mt-4 text-xs text-gray-500">Coordonnées de référence : Rouen (49.4431, 1.0993)</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-2xl font-semibold">Version intermédiaire rapide</h2>
            <p className="mt-2 text-gray-600">Si vous voulez publier vite : utilisez cette page simplifiée (formulaire mailto + informations). Elle est prête à être déployée sur GitHub Pages ou Netlify.</p>
            <label className="mt-3 inline-flex items-center gap-2">
              <input type="checkbox" checked={showIntermediate} onChange={() => setShowIntermediate(s => !s)} /> Afficher la version intermédiaire
            </label>
            {showIntermediate && (
              <div className="mt-3 p-3 border rounded">
                <p className="text-sm">Titre, prix listés, bouton réservation qui ouvre le client mail. Minimal et prêt à déployer.</p>
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-2xl font-semibold">Réserver</h2>
            <form onSubmit={submitReservation} className="mt-4 space-y-3">
              <input required className="w-full p-2 border rounded" placeholder="Nom" value={name} onChange={e => setName(e.target.value)} />
              <input required type="email" className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
              <input className="w-full p-2 border rounded" placeholder="Téléphone" value={phone} onChange={e => setPhone(e.target.value)} />
              <input type="date" className="w-full p-2 border rounded" value={date} onChange={e => setDate(e.target.value)} />

              <label className="block text-sm">Formule</label>
              <select className="w-full p-2 border rounded" value={selected} onChange={e => setSelected(Number(e.target.value))}>
                {packages.map(p => <option key={p.id} value={p.id}>{p.title} — {p.price} €</option>)}
              </select>

              <button type="submit" className="w-full py-2 rounded-lg bg-black text-white">Envoyer la demande</button>
              <p className="text-xs text-gray-500">Le formulaire ouvre votre client mail (solution sans back-end). Pour recevoir des réservations directement sur le site, connectez Formspree ou Netlify Forms.</p>
            </form>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-2xl font-semibold">Carte & repères</h2>
            <p className="mt-2 text-gray-600">Repère : Rouen. (Vous pouvez remplacer l'iframe par une intégration Leaflet/Mapbox pour plus d'interactivité.)</p>
            <div className="mt-3">
              <iframe title="Carte Rouen" src="https://www.openstreetmap.org/export/embed.html?bbox=1.0%2C49.4%2C1.2%2C49.5&layer=mapnik" style={{border:0, width:'100%', height:240}}></iframe>
              <div className="text-xs text-gray-500 mt-2">Carte OpenStreetMap intégrée en iframe.</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow text-sm">
            <h3 className="font-semibold">Déployer gratuitement</h3>
            <ul className="mt-2 list-disc ml-5 space-y-1">
              <li>Créer un repo GitHub et pousser l'app -> utiliser GitHub Pages (si site statique) ou Netlify (plus flexible).</li>
              <li>Pour recevoir des formulaires sans back-end : Formspree ou Netlify Forms (gratuit pour usages basiques).</li>
              <li>Remplacer l'image/logo, ajuster textes et e-mail de contact dans le code.</li>
            </ul>
          </div>
        </aside>
      </main>

      <footer className="max-w-5xl mx-auto mt-8 text-center text-xs text-gray-500">
        Prototype gratuit • Modifiez le code et déployez-le gratuitement.
      </footer>
    </div>
  );
}
