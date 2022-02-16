import http from "../http-common";

class ItemsDataService {

  getAll() {
    //const { authState, oktaAuth } = useOktaAuth();

      return http.get("/items");

  }
  get(id) {

      return http.get(`/items/${id}`);

  }
  create(data) {
    //const { authState, oktaAuth } = useOktaAuth();
      return http.post("/items", data);

  }
  update(id, data) {
    //const { authState, oktaAuth } = useOktaAuth();

      return http.put(`/items/${id}`, data);

  }
  delete(id) {
    //const { authState, oktaAuth } = useOktaAuth();

      return http.delete(`/items/${id}`);

  }
  deleteAll() {
    //const { authState, oktaAuth } = useOktaAuth();

      return http.delete(`/items`);

  }

}
export default new ItemsDataService();