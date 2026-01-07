import {HttpResponse, http } from "msw";

// export const handlers = [
//   rest.get("/hello", (req, res, ctx) => {
//     return res(
//       ctx.json({
//         response:[
//           {
//             "userId": 1,
//             "id": 1,
//             "title": "delectus aut autem",
//             "completed": false
//           },
//           {
//             "userId": 2,
//             "id": 2,
//             "title": "delectus aut autem",
//             "completed": false
//           },
//           {
//             "userId": 3,
//             "id": 3,
//             "title": "delectus aut autem",
//             "completed": false
//           }
//         ]
//       })
//     );
//   }),
// ];

export const handlers = [
  // Intercept "GET https://example.com/user" requests...
  http.get('http://localhost:3000/todos', () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json({ data:['aa','bb','cc']})
  }),
]