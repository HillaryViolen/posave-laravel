<?php

namespace App\Services\Chatbot;

use App\Models\User;
use App\Services\Chatbot\Tools\CreateInventoryItemTool;
use App\Services\Chatbot\Tools\GetCategoriesTool;
use App\Services\Chatbot\Tools\GetFinancialSummaryTool;
use App\Services\Chatbot\Tools\GetInventorySummaryTool;
use App\Services\Chatbot\Tools\GetPageLinkTool;
use App\Services\Chatbot\Tools\ToolInterface;

class ToolRegistry
{
  /** @return ToolInterface[] */
  private static function all(): array
  {
    return [
      new GetInventorySummaryTool(),
      new GetCategoriesTool(),
      new CreateInventoryItemTool(),
      new GetPageLinkTool(),
      new GetFinancialSummaryTool(),
    ];
  }

  /** Tool yang boleh ditawarkan ke user ini — dicek di server, bukan cuma prompt. */
  public static function availableFor(User $user): array
  {
    return array_values(array_filter(self::all(), fn(ToolInterface $t) => $t->isAvailableFor($user)));
  }

  public static function find(string $name, User $user): ?ToolInterface
  {
    foreach (self::availableFor($user) as $tool) {
      if ($tool->name() === $name) {
        return $tool;
      }
    }
    return null;
  }

  public static function toGeminiSchema(User $user): array
  {
    return array_map(fn(ToolInterface $t) => [
      'type' => 'function',
      'name' => $t->name(),
      'description' => $t->description(),
      'parameters' => $t->parameters(),
    ], self::availableFor($user));
  }
}
