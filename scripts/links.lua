local stringify = pandoc.utils.stringify
local headers = {}

function collect(header)
  headers[stringify(header)] = header.identifier
end

function fix_spurious_link(span)
  if span.classes:includes 'spurious-link' then
    local content = span.content[1].content
    local target = span.attributes.target
    local header_target = headers[target]
    if header_target then
      return pandoc.Link(content, '#' .. header_target)
    end
    if target then
      return pandoc.Link(target, target)
    end
  end
end

function extract_links(Para)
  Links = {}
  for i, el in pairs(Para.content) do
    if el.t == "Link" then
      table.insert(Links, el.target)
      table.insert(Links, "\n")
    end
  end
  return pandoc.Para(Links)
end

function Pandoc(doc)
  local filter = {
    Header = collect,
    Span = fix_spurious_link
  }
  local walked_doc = doc:walk(filter)
  local links = walked_doc:walk { Para = extract_links }
  local hblocks = {}
  for i, el in pairs(links.blocks) do
    if (el.t == "Para") then
      table.insert(hblocks, el)
    end
  end
  return pandoc.Pandoc(hblocks, doc.meta)
end
