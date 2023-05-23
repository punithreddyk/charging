import React, { Component } from 'react';
import './style.css'

class Main extends Component {

  render() {
    return (
      <div id="content">
        <p class="percentage">
        <h1>Add Station &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;52%</h1>
        </p>
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.stationName.value
          const price = window.web3.utils.toWei(this.stationgasPrice.value.toString(), 'Ether')
          this.props.createStation(name, price)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="stationtName"
              type="text"
              ref={(input) => { this.stationName = input }}
              className="form-control"
              placeholder="station Name"
              class="boxsize"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="stationgasPrice"
              type="text"
              ref={(input) => { this.stationgasPrice = input }}
              className="form-control"
              placeholder="station gas Price"
              class="boxsize"
              required />

          </div>
          <button type="submit" className="btn btn-primary">Add</button>
        </form>
        <p>&nbsp;</p>
        <h2>Buy Gas</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="stationList">
          { this.props.stations.map((station, key) => {
              return(
                <tr key={key} class="tablesize">
                  <th scope="row">{station.id.toString()}</th>
                  <td>{station.name}</td>
                  <td>{window.web3.utils.fromWei(station.price.toString(), 'Ether')} Eth</td>
                  <td class="tablesize">{station.owner}</td>
                  <td class="tablesize">
                    { !station.purchased
                      ? <div><button
                          name={station.id}
                          value={station.price}
                          onClick={(event) => {
                            this.props.purchasegas(event.target.name, event.target.value)
                          }}
                        >
                          Buy
                        </button>
                        
                        </div>
                      : null
                    }
                    </td>
                </tr>
              )
            })} 
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;

