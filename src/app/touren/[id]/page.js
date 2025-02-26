

export default function TourDetails({ params }) {
    const { id } = params;
    // Hier Daten für die jeweilige Tour laden und anzeigen
    return (
        <div>
            <h1>Tour {id} Details</h1>
            {/* Bilder, Beschreibung, etc. */}
        </div>
    );
}