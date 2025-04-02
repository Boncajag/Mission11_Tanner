using Microsoft.AspNetCore.Mvc;
using Mission11_Tanner_Project.API.Data;

namespace Mission11_Tanner_Project.API.Controllers
{
    // Define the base route for the controller as "api/Bookstore"
    [Route("api/[controller]")]
    [ApiController] // Mark the controller as an API controller, which enables automatic model validation and response formatting
    public class BookstoreController : ControllerBase
    {
        // Declare a private readonly field to hold the database context
        private readonly BookDbContext _bookContext;

        // Constructor to initialize the database context
        // Dependency Injection injects BookDbContext when the controller is instantiated
        public BookstoreController(BookDbContext temp) => _bookContext = temp;

        // Add the HttpGet attribute to handle GET requests at "api/Bookstore"
        [HttpGet]
        public ActionResult<IEnumerable<Book>> GetBooks()
        {
            // Fetch all books from the database and convert them to a list
            var books = _bookContext.Books.ToList();

            // Return the list of books with an HTTP 200 OK response
            return Ok(books);
        }

        [HttpGet("category/{category}")]
        public ActionResult<IEnumerable<Book>> GetBooksByCategory(string category)
        {
            var books = _bookContext.Books
                .Where(b => b.Category == category)
                .ToList();

            return Ok(books);
        }
    }
}
