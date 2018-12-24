//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace WebsiteQuyetTien_byAurora_Team.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Product
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Product()
        {
            this.CashBillDetails = new HashSet<CashBillDetail>();
            this.InstallmentBillDetails = new HashSet<InstallmentBillDetail>();
        }
    
        public int ID { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public int ProductTypeID { get; set; }
        public long SalePrice { get; set; }
        public long OriginPrice { get; set; }
        public long InstallmentPrice { get; set; }
        public int Quantity { get; set; }
        public string Avatar { get; set; }
        public Nullable<bool> Status { get; set; }
        public string Description { get; set; }
        public Nullable<int> ManufactoryID { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<CashBillDetail> CashBillDetails { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<InstallmentBillDetail> InstallmentBillDetails { get; set; }
        public virtual Manufactory Manufactory { get; set; }
        public virtual ProductType ProductType { get; set; }
    }
}
