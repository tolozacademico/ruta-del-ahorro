import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import Header from './Header.js';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para manejar clicks en el mapa
function MapClickHandler({ onLocationChange }) {
    useMapEvents({
        click(e) {
        onLocationChange([e.latlng.lat, e.latlng.lng]);
        },
    });
    return null;
}

const MapView = ({ products, onBack }) => {
    //const [userLocation, setUserLocation] = useState([4.6097, -74.0817]); // Bogotá por defecto

    const [radius, setRadius] = useState(1000); // Radio en metros
    const [supermarkets, setSupermarkets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);

// Reemplaza tu useEffect actual por estos dos efectos separados
useEffect(() => {
    const defaultLocation = [4.6097, -74.0817]; // Bogotá por defecto
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setSelectedLocation([
                    position.coords.latitude, 
                    position.coords.longitude
                ]);
            },
            (error) => {
                console.log('Error obteniendo ubicación:', error);
                setSelectedLocation(defaultLocation);
            }
        );
    } else {
        setSelectedLocation(defaultLocation);
    }
}, []);

// Segundo efecto para manejar cambios en selectedLocation y radius
useEffect(() => {
    if (selectedLocation) {
        searchSupermarkets(selectedLocation[0], selectedLocation[1], radius);
    }
}, [selectedLocation, radius]);

  // Función para buscar supermercados usando Overpass API
    const searchSupermarkets = async (lat, lng, radiusMeters) => {
        setLoading(true);
        try {
        const overpassQuery = `
            [out:json][timeout:25];
            (
            node["shop"="supermarket"](around:${radiusMeters},${lat},${lng});
            way["shop"="supermarket"](around:${radiusMeters},${lat},${lng});
            relation["shop"="supermarket"](around:${radiusMeters},${lat},${lng});
            );
            out center;
        `;

        const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: overpassQuery,
            headers: {
            'Content-Type': 'text/plain',
            },
        });

        const data = await response.json();
        
        const supermarketsList = data.elements.map(element => ({
            id: element.id,
            name: element.tags?.name || 'Supermercado',
            brand: element.tags?.brand || '',
            lat: element.lat || element.center?.lat,
            lng: element.lon || element.center?.lon,
            address: element.tags?.['addr:street'] || '',
        })).filter(market => market.lat && market.lng);

        setSupermarkets(supermarketsList);
        } catch (error) {
        console.error('Error buscando supermercados:', error);
        } finally {
        setLoading(false);
        }
    };

  // Buscar supermercados cuando cambie la ubicación o el radio
    useEffect(() => {
        if (selectedLocation) {
        searchSupermarkets(selectedLocation[0], selectedLocation[1], radius);
        }
    }, [selectedLocation, radius]);

    const handleLocationChange = (newLocation) => {
        setSelectedLocation(newLocation);
    };

    const generateRoute = () => {
        if (supermarkets.length === 0) {
        alert('No se encontraron supermercados en la zona seleccionada');
        return;
        }
    
    // Aquí puedes implementar la lógica para generar la ruta óptima
    alert(`Ruta generada para ${supermarkets.length} supermercados con ${products.length} productos`);
    console.log('Supermercados encontrados:', supermarkets);
    console.log('Productos:', products);
    };

    return (
        <div className="map-view">
        <Header />
        
        <main className="map-main">
            <div className="map-container">
            <div className="map-header">
                <button onClick={onBack} className="back-button">
                ← Volver
                </button>
                <h2 className="map-title">Configura tu zona para mercar</h2>
            </div>

            <div className="map-controls">
                <div className="control-group">
                <label htmlFor="radius">Radio de búsqueda:</label>
                <select 
                    id="radius"
                    value={radius} 
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="radius-select"
                >
                    <option value={500}>500m</option>
                    <option value={1000}>1km</option>
                    <option value={2000}>2km</option>
                    <option value={5000}>5km</option>
                </select>
                </div>
                
                <div className="results-info">
                {loading ? (
                    <span>Buscando supermercados...</span>
                ) : (
                    <span>{supermarkets.length} supermercados encontrados</span>
                )}
                </div>
            </div>

            <div className="leaflet-container">
                {selectedLocation && (
                <MapContainer
                    center={selectedLocation}
                    zoom={13}
                    style={{ height: '400px', width: '100%' }}
                    className="leaflet-map"
                >
                    <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    
                    <MapClickHandler onLocationChange={handleLocationChange} />
                    
                    {/* Marcador de ubicación seleccionada */}
                    <Marker position={selectedLocation}>
                    <Popup>Tu ubicación seleccionada</Popup>
                    </Marker>
                    
                    {/* Círculo que muestra el radio de búsqueda */}
                    <Circle
                    center={selectedLocation}
                    radius={radius}
                    color="#ff6b35"
                    fillColor="#ff6b35"
                    fillOpacity={0.1}
                    />
                    
                    {/* Marcadores de supermercados */}
                    {supermarkets.map((market) => (
                    <Marker
                        key={market.id}
                        position={[market.lat, market.lng]}
                        icon={L.icon({
                        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41],
                        className: 'supermarket-marker'
                        })}
                    >
                        <Popup>
                        <div className="supermarket-popup">
                            <h4>{market.name}</h4>
                            {market.brand && <p><strong>Marca:</strong> {market.brand}</p>}
                            {market.address && <p><strong>Dirección:</strong> {market.address}</p>}
                        </div>
                        </Popup>
                    </Marker>
                    ))}
                </MapContainer>
                )}
            </div>

            <div className="map-footer">
                <p className="map-instruction">
                Haz clic en el mapa para cambiar tu ubicación de búsqueda
                </p>
                
                <button 
                onClick={generateRoute}
                className="generate-route-button"
                disabled={loading || supermarkets.length === 0}
                >
                GENERAR RUTA
                </button>
            </div>
            </div>
        </main>
        </div>
    );
    };

export default MapView;