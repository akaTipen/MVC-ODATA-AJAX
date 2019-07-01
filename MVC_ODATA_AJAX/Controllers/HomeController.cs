using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MVC_ODATA_AJAX.Models;

namespace MVC_ODATA_AJAX.Controllers
{
    public class HomeController : Controller
    {
        private CompanyEntities db = new CompanyEntities();

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult List()
        {
            var DepartementList = db.Departments.Select(a => new { a.DepartmentId, a.DepartmenName }).ToList();
            List<SelectListItem> DepartementListItem = new SelectList(DepartementList, "DepartmentId", "DepartmenName").ToList();
            ViewBag.DepartementListItem = DepartementListItem;
            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        [HttpPost]
        public JsonResult UploadFile()
        {
            if (Request.Files.Count > 0)
            {
                HttpFileCollectionBase files = Request.Files;
                byte[] file = new byte[files["file"].ContentLength];
                files["file"].InputStream.Read(file, 0, file.Length);
                int id = Convert.ToInt32(Request.Form["id"]);
                Employee employee = db.Employees.Find(id);
                employee.Photo = file;
                db.SaveChanges();

                return Json(new { success = true, ResponseMessage = "sukses" });
            }
            else {
                return Json(new { success = false, ResponseMessage = "Tidak ada data" });
            }
            
        }

        public FileResult GetReport(int Id)
        {
            Employee model = db.Employees.Find(Id);
            return File(model.Photo, "application/pdf");
        }
    }
}