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
    
    public partial class InstallmentBill
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public InstallmentBill()
        {
            this.InstallmentBillDetails = new HashSet<InstallmentBillDetail>();
            Date = DateTime.Now;
        }
    
        public int ID { get; set; }
        public string BillCode { get; set; }
        public int CustomerID { get; set; }
        public System.DateTime Date { get; set; }
        public string Shipper { get; set; }
        public string Note { get; set; }
        public string Method { get; set; }
        public int Period { get; set; }
        public long GrandTotal { get; set; }
        public int Taken { get; set; }
        public int Remain { get; set; }
    
        public virtual Customer Customer { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<InstallmentBillDetail> InstallmentBillDetails { get; set; }
    }
}
