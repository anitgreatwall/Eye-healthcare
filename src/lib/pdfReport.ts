import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

// 通过 html2canvas 截取报告 DOM（可正确渲染中文），再放入 PDF
export async function exportElementToPdf(element: HTMLElement, filename: string) {
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true,
  })
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()
  const margin = 10
  const imgW = pageW - margin * 2
  const imgH = (canvas.height / canvas.width) * imgW

  let heightLeft = imgH
  let position = margin
  pdf.addImage(imgData, 'PNG', margin, position, imgW, imgH)
  heightLeft -= pageH - margin * 2

  // 内容超过一页则分页
  while (heightLeft > 0) {
    pdf.addPage()
    position = margin - (imgH - heightLeft)
    pdf.addImage(imgData, 'PNG', margin, position, imgW, imgH)
    heightLeft -= pageH - margin * 2
  }
  pdf.save(filename)
}
