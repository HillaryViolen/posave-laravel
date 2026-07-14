<?php

namespace App\Services\Chatbot\Tools;

use App\Models\User;

interface ToolInterface
{
  public function name(): string;

  public function description(): string;

  public function parameters(): array;

  public function isReadOnly(): bool;

  public function isAvailableFor(User $user): bool;

  public function execute(User $user, array $args): array;

  public function summarize(User $user, array $args): array;

  public function formFields(User $user, array $currentArgs): array;
}
