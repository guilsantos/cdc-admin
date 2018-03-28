import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';

class FormularioAutor extends Component {

	constructor() {  
    super();
    this.state = { nome: '', email: '', senha: '' };
    this.enviaForm = this.enviaForm.bind(this);
    this.setNome = this.setNome.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setSenha = this.setSenha.bind(this);
	}

	enviaForm(evento){
    evento.preventDefault();
    console.log('nome: ' + this.state.nome + ' email: ' + this.state.email + ' senha: ' + this.state.senha);
    $.ajax({
      url: 'http://cdc-react.herokuapp.com/api/autores',
      contentType: 'application/json',
      dataType: 'json',
      type: 'post',
      data: JSON.stringify({nome: this.state.nome, email: this.state.email, senha: this.state.senha}),
      success: function(response){
				this.props.callbackAtualiza(response);
        console.log('sucesso');
      }.bind(this),
      error: function(response){
        console.log('erro');
      }
    })
  }

  setNome(evento){
    this.setState({nome: evento.target.value});
  }

  setEmail(evento){
    this.setState({email: evento.target.value});
  }

  setSenha(evento){
    this.setState({senha: evento.target.value});
  }
	
	render() {
		return (
			<div className="pure-form pure-form-aligned">
				<form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
					<InputCustomizado id="nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome} label="Nome" />
					<InputCustomizado id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail} label="Email" />
					<InputCustomizado id="senha" type="password" name="senha" value={this.state.senha} onChange={this.setSenha} label="Senha" />
					<div className="pure-control-group">
						<label></label>
						<button type="submit" className="pure-button pure-button-primary">Gravar</button>
					</div>
				</form>
			</div>
		)
	}
}

class TabelaAutor extends Component {
	
	render() {
		return (
				<div>
					<table className="pure-table">
						<thead>
							<tr>
								<th>Nome</th>
								<th>email</th>
							</tr>
						</thead>
						<tbody>
							{
								this.props.lista.map(function (autor) {
									return (
										<tr key={autor.id}>
											<td>{autor.nome}</td>
											<td>{autor.email}</td>
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

export default class AutorBox extends Component {
	
	constructor() {  
    super();
		this.state = { lista : [] };
		this.atualizalistagem = this.atualizalistagem.bind(this)
	}

	atualizalistagem(novaLista){
		this.setState({lista:novaLista});
	}
	
	render() {
		return (
			<div className="content" id="content">
				<FormularioAutor callbackAtualiza={this.atualizalistagem}/>
        <TabelaAutor lista={this.state.lista}/>
			</div>
		)
	}
}