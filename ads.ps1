param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Args
)
python -m claude_ads_core @Args
