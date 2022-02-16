import React, { Component } from "react";
import ItemDataService from "../apiclient/todolist";
import { Link } from "react-router-dom";
import {useOktaAuth} from "@okta/okta-react";

export default class ItemsList extends Component {
  constructor(props) {
    super(props);
    this.retrieveItems = this.retrieveItems.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveItem = this.setActiveItem.bind(this);
    this.removeAllItems = this.removeAllItems.bind(this);
    this.state = {
      items: [],
      currentItem: null,
      currentIndex: -1,
    };
  }
  componentDidMount() {
    this.retrieveItems();
  }

  retrieveItems() {

        ItemDataService.getAll()
            .then(response => {
              this.setState({
                items: response.data
              });
              console.log(response.data);
            })
            .catch(e => {
              console.log(e);
            });


  }
  refreshList() {
    this.retrieveItems();
    this.setState({
      currentItem: null,
      currentIndex: -1
    });
  }
  setActiveItem(item, index) {
    this.setState({
      currentItem: item,
      currentIndex: index
    });
  }
  removeAllItems() {
    ItemDataService.deleteAll()
      .then(response => {
        console.log(response.data);
        this.refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const {  items, currentItem, currentIndex } = this.state;
    return (
      <div className="list row">

        <div className="col-md-6">
          <h4>Items List</h4>
          <ul className="list-group">
            {items &&
              items.map((item, index) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActiveItem(item, index)}
                  key={index}
                >
                  {item.taskname}
                </li>
              ))}
          </ul>
          <button
            className="m-3 btn btn-sm btn-danger"
            onClick={this.removeAllItems}
          >
            Remove All
          </button>
        </div>
        <div className="col-md-6">
          {currentItem ? (
            <div>
              <h4>Item</h4>
              <div>
                <label>
                  <strong>Task Name:</strong>
                </label>{" "}
                {currentItem.taskname}
              </div>
              <div>
                <label>
                  <strong>Description:</strong>
                </label>{" "}
                {currentItem.description}
              </div>
              <div>
                <label>
                  <strong>Status:</strong>
                </label>{" "}
                {currentItem.status ? "Completed" : "Pending"}
              </div>
              <div>
                <label>
                  <strong>DueDate:</strong>
                </label>{" "}
                {currentItem.duedate}
              </div>
              <Link
                to={"/items/" + currentItem.id}
                className="badge badge-warning"
              >
                Edit
              </Link>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Item...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}