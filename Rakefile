require 'rubygems'
require 'rake'
require 'modulr'
require 'erb'

task :build do
  t = ERB.new(IO.read('index.erb'), nil, '%')
  js = Modulr.ize(File.join('js', 'program.js'), { :sync => true })
  css = File.read('main.css')
  s = t.result(binding)
  File.open('index.html', 'w') { |f| f << s }
  puts "output size: " + s.length.to_s
end