require 'pdf-reader'
require 'open-uri'

class Page < ApplicationRecord
   def parsePDF() 
        io     = open(self.url)
        reader = PDF::Reader.new(io)
        reader.pages.each do |page|
            pageText = page.text
            puts pageText
            self.content = page.text
        end
        self.content
    end
end
