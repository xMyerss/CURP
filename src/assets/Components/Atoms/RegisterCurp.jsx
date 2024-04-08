import React, { Component } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import curp from 'curp';
import '../../styles/estilos.css';
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import QRCode from 'qrcode.react';

class App extends Component {
 
  constructor(props) {
    super(props);
    this.state = {
      curpGenerada: '',
      isHuman: false, 
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCaptchaChange = this.handleCaptchaChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    let isValid = true;
  
    for (const [name, value] of formData.entries()) {
      if (!value) {
        alert(`Por favor, complete el campo ${name}.`);
        isValid = false;
        break;
      }
  
      if (name === 'nombre' || name === 'apellidoPaterno' || name === 'apellidoMaterno') {
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          alert(`El campo ${name} solo debe contener letras.`);
          isValid = false;
          break;
        }
      }
    }
  
    if (!isValid) {
      return;
    }
  
    if (isValid && !this.state.isHuman) {
      alert('Por favor, complete el CAPTCHA.');
      return;
    }

    let persona = curp.getPersona();
    persona.nombre = event.target.nombre.value.split(' ')[0]; // Solo toma el primer nombre
    persona.apellidoPaterno = event.target.apellidoPaterno.value;
    persona.apellidoMaterno = event.target.apellidoMaterno.value;
    persona.genero = event.target.genero.value === 'H' ? curp.GENERO.MASCULINO : curp.GENERO.FEMENINO;
    persona.fechaNacimiento = event.target.fechaNacimiento.value.split('-').reverse().join('-'); 
    persona.estado = event.target.estado.value === 'Chiapas' ? curp.ESTADO.CHIAPAS : curp.ESTADO.OAXACA;

    const curpGenerada = curp.generar(persona);
    this.setState({ curpGenerada });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
  
    if (name === 'fechaNacimiento') {
      const fecha = new Date(value);
      const fechaMinima = new Date('1900-01-01');
      if (fecha < fechaMinima) {
        alert('La fecha no puede ser anterior a 1900.');
        return;
      }
    }
  
    this.setState({
      [name]: value
    });
  }

  handleCaptchaChange(value) {
    if (value) {
      this.setState({ isHuman: true });
    }
  }



  render() {
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toISOString().split('T')[0];

    return (
      <div className="container">
        <form onSubmit={this.handleSubmit}>
        <h1>CURP</h1>
          <div className="form-group">
            <label>Nombre:</label>
            <input type="text" name="nombre" className="form-control" />
          </div>
          <div className="form-group">
            <label>Apellido Paterno:</label>
            <input type="text" name="apellidoPaterno" className="form-control" />
          </div>
          <div className="form-group">
            <label>Apellido Materno:</label>
            <input type="text" name="apellidoMaterno" className="form-control" />
          </div>
          <div className="form-group">
            <label>Fecha de Nacimiento:</label>
            <input type="date" name="fechaNacimiento" className="form-control"  min="1900-01-01" max={fechaFormateada} />
          </div>
          <div className="form-group">
            <label>Género:</label>
            <select name="genero" className="form-control">
              <option value="H">Hombre</option>
              <option value="M">Mujer</option>
            </select>
          </div>
          <div className="form-group">
            <label>Estado:</label>
            <select name="estado" className="form-control">
              <option value="Chiapas">Chiapas</option>
              <option value="Oaxaca">Oaxaca</option>
            </select>
          </div>
          <ReCAPTCHA
            sitekey="6LdK1JcpAAAAAKUOru06VGtzq3LuFnV1r03PSZP7"
            onChange={this.handleCaptchaChange}
          />
          <button type="submit" className="btn btn-primary">
            <HiMiniMagnifyingGlass  size={20} />Buscar
          </button>
        </form>
        {this.state.curpGenerada && (
          <div className="curp">
            <h2>Su curp es:</h2>
            <p>{this.state.curpGenerada}</p>
            <QRCode value={this.state.curpGenerada} />
          </div>
        )}
      </div>
    );
  }
}

export default App;
