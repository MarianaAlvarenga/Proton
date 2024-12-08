import React, { useEffect } from 'react';
import 'bulma-carousel/dist/css/bulma-carousel.min.css';
import bulmaCarousel from 'bulma-carousel'; // Aquí cambiamos para importar correctamente
import '../../pages/MenuAdmin.css';
import { useWindowSize } from '../../Hooks/useWindowSize'; 

const Carousel = () => {
  const { width } = useWindowSize();

  React.useEffect(() => {
    if (width > 768) {
      bulmaCarousel.attach('.carousel'); // Ahora lo usamos directamente sin `window`
    }
  }, [width]);

  return (
    <div className={`carousel ${width > 768 ? 'carousel-fullscreen' : ''}`}>
      <div className="carousel-item">
        <img src={require("../../assets/images/BANNER1.jpg")} alt="Imagen 1" />
      </div>
      <div className="carousel-item">
        <img src={require("../../assets/images/BANNER2.jpg")} alt="Imagen 2" />
      </div>
      <div className="carousel-item">
        <img src={require("../../assets/images/BANNER3.jpg")} alt="Imagen 3" />
      </div>
    </div>
  );
};

export default Carousel;
