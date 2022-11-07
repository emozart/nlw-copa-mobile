import { useState } from "react";
import { VStack, Heading, Text, useToast } from "native-base";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import Logo from "../assets/logo.svg";

import { api } from "../services/api";

export function New() {
  const [title, setTitle] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const toast = useToast();

  async function handlePoolCreate() {
    if (title.trim() === "") {
      return toast.show({
        title: "Informe um nome para o bolão",
        placement: "top",
        bgColor: "red.500",
      });
    }

    try {
      setIsLoaded(true);

      await api.post("/pools", { title });

      setTitle("");

      toast.show({
        title: "Bolão criado com sucesso!",
        placement: "top",
        bgColor: "green.500",
      });
    } catch (error) {
      console.log(error);
      toast.show({
        title: "Não foi possível criar o bolão",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoaded(false);
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Criar novo bolão" />
      <VStack mt={8} mx={5} alignItems="center">
        <Logo width={212} height={40} />
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          my={8}
          textAlign="center"
        >
          Crie seu próprio bolão da copa{"\n"}e compartilhe entre amigos!
        </Heading>
        <Input
          mb={2}
          placeholder="Nome do bolão"
          onChangeText={setTitle}
          value={title}
        />
        <Button
          title="CRIAR MEU BOLÃO"
          onPress={handlePoolCreate}
          isLoading={isLoaded}
        />
        <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas para participar do seu bolão.
        </Text>
      </VStack>
    </VStack>
  );
}
