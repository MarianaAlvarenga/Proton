import React from "react";
import './custom-bulma.css';

// Se le puede agregar la clase is-selected
const Table = () => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th><abbr title="nombre">Nombre</abbr></th>
          <th><abbr title="apellido">Apellido</abbr></th>
          <th><abbr title="rol">Rol</abbr></th>
          <th><abbr title="seleccionar">Sel</abbr></th>
        </tr>
      </thead>
      <tfoot>
        <tr>
          <th>ID</th>
          <th><abbr title="nombre">Nombre</abbr></th>
          <th><abbr title="apellido">Apellido</abbr></th>
          <th><abbr title="rol">Rol</abbr></th>
          <th><abbr title="seleccionar">Sel</abbr></th>
        </tr>
      </tfoot>
      <tbody>
        <tr>
          <td>38</td>
          <td>Pepito</td>
          <td>Gonzales</td>
          <td>68</td>
          <td><input type="checkbox" /></td>
        </tr>
        <tr>
          <td>38</td>
          <td>Lolita</td>
          <td>Perez</td>
          <td>65</td>
          <td><input type="checkbox" /></td>
        </tr>
        <tr>
          <td>38</td>
          <td>Menganito</td>
          <td>Basualdo</td>
          <td>69</td>
          <td><input type="checkbox" /></td>
        </tr>
        <tr>
          <td>38</td>
          <td>Susanito</td>
          <td>Rodriguez</td>
          <td>71</td>
          <td><input type="checkbox" /></td>
        </tr>
        <tr>
          <td>38</td>
          <td>Protoncito</td>
          <td>Garcia Alvarenga</td>
          <td>49</td>
          <td><input type="checkbox" /></td>
        </tr>
        <tr>
          <td>38</td>
          <td>Morita</td>
          <td>Hiede</td>
          <td>59</td>
          <td><input type="checkbox" /></td>
        </tr>
        <tr>
          <td>38</td>
          <td>Peluquita</td>
          <td>Suarez</td>
          <td>65</td>
          <td><input type="checkbox" /></td>
        </tr>
        <tr>
          <td>38</td>
          <td>Caselita</td>
          <td>Casella</td>
          <td>63</td>
          <td><input type="checkbox" /></td>
        </tr>
        <tr>
          <td>38</td>
          <td>Rubencito</td>
          <td>Alvarenga</td>
          <td>41</td>
          <td><input type="checkbox" /></td>
        </tr>
        <tr>
          <td>38</td>
          <td>Gaston</td>
          <td>Garcia Bauer</td>
          <td>59</td>
          <td><input type="checkbox" /></td>
        </tr>
        <tr>
          <td>38</td>
          <td>Mariana</td>
          <td>Alvarenga</td>
          <td>59</td>
          <td><input type="checkbox" /></td>
        </tr>
        <tr>
          <td>38</td>
          <td>Anita</td>
          <td>Hiede</td>
          <td>42</td>
          <td><input type="checkbox" /></td>
        </tr>
        <tr>
          <td>38</td>
          <td>Juancito</td>
          <td>Moranelli</td>
          <td>40</td>
          <td><input type="checkbox" /></td>
        </tr>
        <tr>
          <td>38</td>
          <td>Marito</td>
          <td>Garcia</td>
          <td>34</td>
          <td><input type="checkbox" /></td>
        </tr>
        <tr>
          <td>38</td>
          <td>Susanita</td>
          <td>Bauer</td>
          <td>39</td>
          <td><input type="checkbox" /></td>
        </tr>
        <tr>
          <td>38</td>
          <td>Danielito</td>
          <td>Graiber</td>
          <td>45</td>
          <td><input type="checkbox" /></td>
        </tr>
        <tr>
          <td>38</td>
          <td>Carito</td>
          <td>Garcia</td>
          <td>48</td>
          <td><input type="checkbox" /></td>
        </tr>
        <tr>
          <td>385</td>
          <td>Facundito</td>
          <td>Alvarenga</td>
          <td>44</td>
          <td><input type="checkbox" /></td>
        </tr>
        <tr>
          <td>38</td>
          <td>Adita</td>
          <td>Fernandez</td>
          <td>39</td>
          <td><input type="checkbox" /></td>
        </tr>
        <tr>
          <td>38</td>
          <td>Teresita</td>
          <td>Reynoso</td>
          <td>27</td>
          <td><input type="checkbox" /></td>
        </tr>
      </tbody>
    </table>
  );
};

export default Table;
