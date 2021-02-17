require 'pdf-reader'
require 'pry'
require 'pdf-reader'
reader = PDF::Reader.new("./node-sample-simplified.pdf")

reader.pages.each do |page|
    # puts page.fonts
    pageText = page.text
    puts pageText
    # puts page.raw_content
    binding.pry
  end

binding.pry
