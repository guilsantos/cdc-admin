import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class FormularioLivro extends Component {

  constructor() {
    super();
    this.state = { titulo: '', preco: '', autorId: '' };
    this.enviaForm = this.enviaForm.bind(this);
    this.setTitulo = this.setTitulo.bind(this);
    this.setPreco = this.setPreco.bind(this);
    this.setAutorId = this.setAutorId.bind(this);
  }

  enviaForm(evento) {
    evento.preventDefault();
    console.log('titulo: ' + this.state.titulo + ' preco: ' + this.state.preco + ' AutorId: ' + this.state.autorId);
    $.ajax({
      url: 'http://cdc-react.herokuapp.com/api/livros',
      contentType: 'application/json',
      dataType: 'json',
      type: 'post',
      data: JSON.stringify({ titulo: this.state.titulo, preco: this.state.preco, autorId: this.state.autorId }),
      success: function (response) {
        PubSub.publish('lista-livros', response);
        this.setState({ titulo: '', preco: '', autorId: '' });
      }.bind(this),
      error: function (response) {
        if (response.status === 400) {
          new TratadorErros().publicaErros(response.responseJSON);
        }
      },
      beforeSend: function () {
        new TratadorErros().limpaErros();
      }
    })
  }

  setTitulo(evento) {
    this.setState({ titulo: evento.target.value });
  }

  setPreco(evento) {
    this.setState({ preco: evento.target.value });
  }

  setAutorId(evento) {
    this.setState({ autorId: evento.target.value });
  }

  render() {
    return (
      <div className="pure-form pure-form-aligned">
        <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
          <InputCustomizado id="titulo" type="text" name="titulo" value={this.state.titulo} onChange={this.setTitulo} label="Titulo" />
          <InputCustomizado id="preco" type="text" name="preco" value={this.state.preco} onChange={this.setPreco} label="Preco" />
          <div className="pure-control-group">
            <label htmlFor="autorId">Autor</label>
            <select value={this.state.autorId} name="autorId" id="autorId" onChange={this.setAutorId}>
              <option value="">Selecione o autor</option>
              {
                this.props.autores.map(function(autor){
                  return (
                    <option value={autor.id}>{autor.nome}</option>
                  )
                })
              }
            </select>
            <span className="error">{this.state.msgErro}</span>
          </div>
          <div className="pure-control-group">
            <label></label>
            <button type="submit" className="pure-button pure-button-primary">Gravar</button>
          </div>
        </form>
      </div>
    )
  }
}

class TabelaLivro extends Component {

  render() {
    return (
      <div>
        <table className="pure-table">
          <thead>
            <tr>
              <th>Titulo</th>
              <th>Preço</th>
              <th>Autor</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.lista.map(function (livro) {
                return (
                  <tr key={livro.id}>
                    <td>{livro.titulo}</td>
                    <td>{livro.preco}</td>
                    <td>{livro.autor.nome}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    )
  }
}

export default class LivroBox extends Component {

  constructor() {  
    super();
		this.state = { lista: [], autores: [] };
	}

	componentDidMount(){
    $.ajax({
      url:'http://cdc-react.herokuapp.com/api/livros',
      dataType: 'json',
      success: function(response){
        this.setState({lista: response});
      }.bind(this)
    });
    
    $.ajax({
      url:'http://cdc-react.herokuapp.com/api/autores',
      dataType: 'json',
      success: function(response){
        this.setState({autores: response});
      }.bind(this)
		});
		
		PubSub.subscribe('lista-livros', function(topico, response){
			this.setState({lista: response});
		}.bind(this));
	}
  render() {
    return (
      <div>
        <div className="header">
          <h1>Lista de Livros</h1>
        </div>
        <div className="content" id="content">
					<FormularioLivro autores={this.state.autores}/>
					<TabelaLivro lista={this.state.lista}/>
				</div>
      </div>
    )
  }
}